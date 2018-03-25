import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthService} from '../../shared/auth.service';
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
  }

  onSubmitRegistration(form: FormGroup) {
    this.auth.createNewUser(form);
  }

  onSubmitLogin(form: FormGroup) {
    this.auth.loginUser(form.value.email, form.value.password).then((data) => {
          this.router.navigate(['/home']);
    }, (err) => {
      this.uiService.showSnackBar(err.message, null, 3000);
    });
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}
