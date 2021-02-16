import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/interfaces';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    /** @internal */
    public _form!: FormGroup;
    /** @internal */
    public _submitted = false;
    /** @internal */
    public _message!: string;

    constructor(public auth: AuthService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: Params) => {
            if (params['loginAgain']) {
                this._message = 'Пожалуйста, введите данные';
            } else if (params['authFailed']) {
                this._message = 'Сессия истекла. Введите данные заново';
            }
        });

        this._form = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ])
        });
    }

    submit(): void {
        if (this._form.invalid) {
            return;
        }

        this._submitted = true;

        const user: User = {
            email: this._form.value.email,
            password: this._form.value.password
        };

        this.auth.login(user).subscribe(() => {
            this._form.reset();
            this.router.navigate(['/admin', 'dashboard']);
            this._submitted = false;
        }, () => {
            this._submitted = false;
        });
    }
}
