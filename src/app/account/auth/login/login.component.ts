import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/core/models/authentication-request';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  authreques: AuthenticationRequest = new AuthenticationRequest();
  error: any = '';
  loginForm: UntypedFormGroup;
  submitted: any = false;
  year: number = new Date().getFullYear();

  constructor(private servauth: AuthenticationService, private router: Router, private formBuilder: UntypedFormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
      });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // Stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.authreques.email = this.f.email.value;
      this.authreques.password = this.f.password.value;

      this.servauth.login(this.authreques).subscribe(
          ress => {
              this.servauth.setUserToken(ress);
              this.router.navigate(["/dashboard"]);
          },
          error => {
              this.error = "email ou mot de pass incorrect";
          }
      )
  }
}

