import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AppService {

  private contactsUrl = '/stage/contacts';  // URL to web api
  private subject = new Subject();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET heroes from the server */
  getContacts = (): Observable<any> => {
    return this.http.get<any>(this.contactsUrl, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
  }

  update(data: any, id: string): Observable<any> {
    return this.http.put<any>(this.contactsUrl + '/' + id, data)
  }

  sendMessage(message) {
    this.subject.next({message})
  }

  clearMessages() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}