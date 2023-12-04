import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userForm!: FormGroup;
  Users: any[] = [];
  isModalOpen = false;
  selectedUser_id: Number | null = null;
  formActionText: string = 'Add User';
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initUserForm();
    this.getUsers();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      _id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.Users = res;
    });
  }

  addUser() {
    let user: User = this.userForm.value;
    console.log(user);
    
    if(this.userForm.valid) {
      if(user._id) {
        this.userService.updateUser(user).subscribe((res)=> {
          this.getUsers();
          this.initUserForm();
          this.closeModal();
        });
      } else {
        this.userService.addUser(user).subscribe((res) => {
          this.getUsers();
          this.initUserForm();
          this.closeModal();
        });
      }
    }
  }

  editUser(user: User): void {
    this.userForm = this.fb.group({
      _id: [user._id],
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [user.email,[Validators.required, Validators.email]],
    });
    this.openModal(user._id);
  }

  deleteUser(_id: Number): void {
    this.userService.deleteUser(_id).subscribe(deletedUser => {
      this.getUsers();
    });
  }

  openModal(userId: Number | null): void {
    if(userId) {
      this.formActionText = 'Edit User';
    } else {
      this.formActionText = 'Add User';
    }
    this.isModalOpen = true;
    this.selectedUser_id = userId;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser_id = null;
  }
}
