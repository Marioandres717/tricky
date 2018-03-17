import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  signUp: FormGroup;
  loading: boolean;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.login = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signUp = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['',Validators.required, Validators.minLength(4), Validators.maxLength(10)],
      password: ['', Validators.required, Validators.minLength(6)],
      birthday: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.loading = false;
  }

  onSubmitRegistration(form: FormGroup) {
    const email = form.value.email,
          password = form.value.password,
          self = this;

    this.loading = true;
    this.auth.createNewUser(email, password).then(function() {
      self.loading = false;
      self.router.navigate(['/home']);
    }, function(err) {
      self.loading = false;
      console.log('err');
    });
  }

  onSubmitLogin(form: FormGroup) {
    const self = this;
    this.loading = true;
    this.auth.loginUser(form.value.email, form.value.password).then(() => {
      this.loading = true;
      self.router.navigate(['/home']);
    }, (err) => {
      this.loading = true;
      console.log('err');
    });
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}
