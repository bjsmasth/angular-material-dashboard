import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {User, UserPagination, Users} from '../../model/user';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersFormDialogComponent} from '../forms/users/users.form';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit, AfterViewInit {

  pageEvent: PageEvent;
  displayedColumns: string[] = ['name', 'username', 'email', 'role', 'created_date', 'status', 'action'];
  listData: MatTableDataSource<User>;
  isLoading = true;
  config: any;
  allData: UserPagination;
  totalLength = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('input', {static: true}) input: ElementRef;

  constructor(private user: UserService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    this.config = {
      itemsPerPage: 10,
      searchParam: '',
      currentPage: 1,
      total: 0,
      order: 'desc',
      order_by: 'id'
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getData();
  }

  pageChanged(event: PageEvent) {
    let pageSize = this.config.itemsPerPage;

    if (event.pageSize !== this.config.itemsPerPage) {
      pageSize = event.pageSize;
    }

    this.getData(event.pageIndex + 1, pageSize, this.config.order_by, this.config.order);
  }

  sortData(event: Sort) {
    this.config.order_by = event.active;
    this.config.order = event.direction;

    if (event.direction && event.active) {
      this.getData(1, 10, this.config.order_by, this.config.order);
    }
  }

  openUserForm(event: Event, id: number = null) {
    event.preventDefault();
    const dialogRef = this.dialog.open(UsersFormDialogComponent, {
      width: '80%',
      data: {
        id: id ? id : null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  private getData(currentPage = 1, pageSize = 10, order_by = 'id', order = 'desc') {
    this.isLoading = true;

    this.user.get(currentPage, pageSize, order_by, order).subscribe(response => {
      this.isLoading = false;
      this.listData = new MatTableDataSource<User>(response.users.data);
      this.allData = response.users;
      this.totalLength = response.users.total;
    }, error => {
      this.isLoading = false;
    });
  }
}
