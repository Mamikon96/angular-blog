import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../shared/interfaces';
import {PostsService} from '../../shared/posts.service';
import {AlertService} from '../shared/services/alert.service';

@Component({
    selector: 'app-create-page',
    templateUrl: './create-page.component.html',
    styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

    /** @internal */
    public _form!: FormGroup;

    constructor(private postService: PostsService,
                private alert: AlertService) {
    }

    ngOnInit(): void {
        this._form = new FormGroup({
            title: new FormControl(null, Validators.required),
            text: new FormControl(null, Validators.required),
            author: new FormControl(null, Validators.required)
        });
    }

    submit(): void {
        if (this._form.invalid) {
            return;
        }

        const post: Post = {
            title: this._form.value.title,
            text: this._form.value.text,
            author: this._form.value.author,
            date: new Date()
        };

        this.postService.create(post).subscribe(() => {
            this._form.reset();
            this.alert.success('Пост был создан');
        });
    }

}
