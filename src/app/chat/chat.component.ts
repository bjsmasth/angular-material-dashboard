import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import Pusher from 'pusher-js';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../services/authentication.service';
import {DeviceDetectorService} from 'ngx-device-detector';

declare const window: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  pusherClient: any;
  caller: any;
  channel: any;
  usersOnline: any;
  id: any;
  users = [];
  sessionDesc;
  currentCaller;
  room;
  localUserMedia;
  selfView: any;
  remoteView: any;

  constructor(private elementRef: ElementRef, private deviceService: DeviceDetectorService, private authService: AuthenticationService) {
    const self = this;
    this.pusherClient = new Pusher('2b40e91cc7a84b7f2858', {
      cluster: 'us2',
      forceTLS: true,
      authEndpoint: `https://bjsmasth.foxit.dev.np/api/v1/broadcast/auth`,
      auth: {
        headers: {
          Authorization: `Bearer  ${this.authService.getSessionToken.access_token}`
        },
      },
    });

    self.channel = this.pusherClient.subscribe('presence-videocall');

    self.channel.bind('pusher:subscription_succeeded', (members) => {
      self.usersOnline = members.count;
      self.id = self.channel.members.me.id;

      members.each((member) => {
        if (member.id != self.channel.members.me.id) {
          self.users.push(member.id)
        }
      });
    });

    self.channel.bind('pusher:member_added', (member) => {
      self.users.push(member.id);
    });

    self.channel.bind('pusher:member_removed', (member) => {
      // for remove member from list:
      const index = self.users.indexOf(member.id);
      self.users.splice(index, 1);
      if (member.id === self.room) {
        self.endCall();
      }
    });

    self.channel.bind('client-candidate', function (msg) {
      if (msg.room === self.room) {
        console.log('candidate received');
        self.caller.addIceCandidate(new RTCIceCandidate(msg.candidate));
      }
    });

    self.channel.bind('client-sdp', function (msg) {
      console.log(msg.room, self.id);
      if (msg.room === self.id) {
        console.log('sdp received');
        const answer = confirm('You have a call from: ' + msg.from + 'Would you like to answer?');
        if (!answer) {
          return self.channel.trigger('client-reject', {'room': msg.room, 'rejected': self.id});
        }
        self.room = msg.room;
        self.getCam()
          .then(stream => {
            self.localUserMedia = stream;
            self.toggleEndCallButton();
            if (window.URL) {
              const mediaStream = new MediaStream(stream);
              self.selfView = mediaStream;
            } else {
              self.selfView.src = stream;
            }
            self.caller.addStream(stream);
            const sessionDesc = new RTCSessionDescription(msg.sdp);
            self.caller.setRemoteDescription(sessionDesc);
            self.caller.createAnswer().then(function (sdp) {
              self.caller.setLocalDescription(new RTCSessionDescription(sdp));
              self.channel.trigger('client-answer', {
                'sdp': sdp,
                'room': self.room
              });
            });

          })
          .catch(error => {
            console.log('an error occured', error);
          })
      }


    });

    self.channel.bind('client-answer', function (answer) {
      if (answer.room === self.room) {
        console.log('answer received');
        self.caller.setRemoteDescription(new RTCSessionDescription(answer.sdp));
      }

    });

    self.channel.bind('client-reject', function (answer) {
      if (answer.room === self.room) {
        console.log('Call declined');
        alert('call to ' + answer.rejected + 'was politely declined');
        self.endCall();
      }

    });

    self.channel.bind('client-endcall', function (answer) {
      if (answer.room === self.room) {
        console.log('Call Ended');
        self.endCall();
      }
    });
  }

  ngOnInit(): void {
    this.getRTCPeerConnection();
    this.getRTCSessionDescription();
    this.getRTCIceCandidate();
    this.prepareCaller();
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#3c4858';
    this.elementRef.nativeElement.ownerDocument.body.style.color = '#fff';
  }

  prepareCaller() {
    const self = this;

    self.caller = new window.RTCPeerConnection();
    self.caller.onicecandidate = function (evt) {
      if (!evt.candidate) {
        return;
      }
      console.log('onicecandidate called');
      self.onIceCandidate(self.caller, evt);
    };

    this.caller.onaddstream = function (evt) {
      console.log('onaddstream called');
      if (window.URL) {
        const mediaStream = new MediaStream(evt.stream);
        self.remoteView = mediaStream;
      } else {
        self.remoteView = evt.stream;
      }
    };
  }

  getCam() {
    const isMobile = this.deviceService.isMobile();
    const isDesktopDevice = this.deviceService.isDesktop();

    let constraints = {};

    if (isMobile) {
      constraints = {
        video: true,
        audio: true
      }
    }
    if (isDesktopDevice) {
      constraints = {
        video: true,
        audio: true
      }
    }

    return navigator.mediaDevices.getUserMedia(constraints);
  }

  getRTCIceCandidate() {
    window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate ||
      window.mozRTCIceCandidate || window.msRTCIceCandidate;

    return window.RTCIceCandidate;
  }

  getRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection || window.msRTCPeerConnection;
    return window.RTCPeerConnection;
  }

  getRTCSessionDescription() {
    window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription ||
      window.mozRTCSessionDescription || window.msRTCSessionDescription;
    return window.RTCSessionDescription;
  }

  callUser(user) {
    const self = this;
    self.getCam()
      .then(stream => {
        if (window.URL) {
          const mediaStream = new MediaStream(stream);
          self.selfView = mediaStream;
        } else {
          self.selfView = stream;
        }
        self.toggleEndCallButton();
        self.caller.addStream(stream);
        self.localUserMedia = stream;
        self.caller.createOffer().then(function (desc) {
          self.caller.setLocalDescription(new RTCSessionDescription(desc));
          self.channel.trigger('client-sdp', {
            'sdp': desc,
            'room': user,
            'from': self.id
          });
          self.room = user;
        });

      })
      .catch(error => {
        console.log('an error occured', error);
      })
  };

  endCall() {
    const self = this;
    self.room = undefined;
    self.caller.close();

    for (let track of self.localUserMedia.getTracks()) {
      track.stop()
    }

    self.prepareCaller();
    self.toggleEndCallButton();

  }

  endCurrentCall() {
    const self = this;
    self.channel.trigger('client-endcall', {
      'room': self.room
    });

    self.endCall();
  }

  onIceCandidate(peer, evt) {
    const self = this;

    if (evt.candidate) {
      self.channel.trigger('client-candidate', {
        'candidate': evt.candidate,
        'room': self.room
      });
    }
  }

  toggleEndCallButton() {
    if (document.getElementById('endCall').style.display === 'block') {
      document.getElementById('endCall').style.display = 'none';
    } else {
      document.getElementById('endCall').style.display = 'block';
    }
  }
}
