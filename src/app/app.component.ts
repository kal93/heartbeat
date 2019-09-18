import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy  {
  name = 'Heartbeat';

  heartBeatSubscription : Subscription;

  constructor(protected heartBeatHttp: HttpClient) {

  }

   ngOnInit() {

    // change 5000 to whatever number
    const observable = interval(5000);
    this.heartBeatSubscription  = observable.pipe(
      // see if flatMap can be used to remove the nested subscription
      flatMap(() => this.callHeartBeat())
    )
    .subscribe(
      intervalResponse => {
        console.log(intervalResponse);
        this.callHeartBeat().subscribe( (heartBeatResponse) => {
          console.log(heartBeatResponse);
        }
        );
      },
      error => {
        console.log('heartbeat error');
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          alert(error.status + ' ' + error.statusText);
        }
      },
      () => {
        console.log('complete');
      }
    );
  }
  callHeartBeat() {
    let hash = 'SU1fQURNSU46a1N6U1JaUWd4URZSRVNUU0VSVkVSQ0FMTA==';
    let headers : HttpHeaders = new HttpHeaders();
    headers.append('Authorization', `Basic ${hash}`);
    return this.heartBeatHttp
      .post('http://localhost:8000/csp/imrestbb/v1/session/heartbeat', '', { headers : headers}); // angular is unable to pass these headers here. Add them to interceptor forecfully
  }

  logout() {
    console.log('kill heartbeat');
    this.heartBeatSubscription.unsubscribe();
  }

  ngOnDestroy() {
     this.heartBeatSubscription.unsubscribe();
  }
}