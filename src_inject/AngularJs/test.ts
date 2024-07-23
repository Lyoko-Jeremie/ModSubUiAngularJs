import {Component, EventEmitter, Inject, Injectable, Input, NgModule, OnInit, Output, bundle} from 'ng-metadata/core';
import ng from 'angular';

// app.component.ts
// import { Component } from 'ng-metadata/core';

@Component({
    selector: 'my-app',
    template: `<hero [name]="$ctrl.name" (call)="$ctrl.onCall($event)"></hero>`
})
export class AppComponent {
    name = 'Martin';

    onCall() { /*...*/
    }
}

// hero.service.ts
// import { Injectable, Inject } from 'ng-metadata/core';

@Injectable()
export class HeroService {
    constructor(@Inject('$http') private $http: ng.IHttpService) {
    }

    fetchAll() {
        return this.$http.get('/api/heroes');
    }
}

// hero.component.ts
// import { HeroService } from './hero.service';

@Component({
    selector: 'hero',
    templateUrl: `
    <div>
    </div>
    `,
    legacy: {transclude: true}
})
export class HeroComponent implements OnInit {

    // one way binding determined by parent template
    @Input() name: string = '';
    @Output() call = new EventEmitter<void>();

    constructor(
        // we need to inject via @Inject because angular 1 doesn't give us proper types
        @Inject('$log') private $log: ng.ILogService,
        // here we are injecting by Type which is possible thanks to reflect-metadata and TypeScript and because our service
        // is defined as a class
        private heroSvc: HeroService
    ) {
    }

    ngOnInit() { /* your init logic */
    }

}

@NgModule({
    declarations: [AppComponent, HeroComponent],
    providers: [HeroService]
})
export class AppModule {
}

const Ng1AppModule = bundle(AppModule, []).name;
export const N1AppModule = ng.module('Ng1AppModule', [Ng1AppModule]);
// const appRootElem = document.querySelector('#my-app') || document.body;
// ng.bootstrap(appRootElem, [N1AppModule.name], {strictDi: true})


