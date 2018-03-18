import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import { UiService } from '../../shared/ui.service';


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
  constructor( private auth: AuthService, private router: Router,  private uiService: UiService ) { }

  ngOnInit() {
    this.login = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email] )),
      password: new FormControl('', Validators.compose([Validators.required]))
    });

    this.signUp = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email] )),
      username: new FormControl('', Validators.compose([ Validators.required, Validators.minLength(4), Validators.maxLength(10)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      birthday: new FormControl ('', Validators.compose([Validators.required])),
      gender: new FormControl ('', Validators.compose([Validators.required]))
    });

    // this.loading = false;
  }

  onSubmitRegistration(form: FormGroup) {
    const email = form.value.email,
          password = form.value.password,
          self = this;

    this.loading = true;
    this.auth.createNewUser(email, password).then((data) => {
      // self.loading = false;
      // console.log(data);
      self.router.navigate(['/home']);
    }, (err) => {
      this.uiService.showSnackBar(err.message, null, 3000);
      self.loading = false;
    });
  }

  onSubmitLogin(form: FormGroup) {
    const self = this;
    // this.loading = true;
    this.auth.loginUser(form.value.email, form.value.password).then((data) => {
      // this.loading = true;
      self.router.navigate(['/home']);
    }, (err) => {
      this.uiService.showSnackBar(err.message, null, 3000);
      // this.loading = true;
    });
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}
