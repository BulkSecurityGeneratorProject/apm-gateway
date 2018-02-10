import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { JhiDateUtils } from 'ng-jhipster';

import { Iteration } from './iteration.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class IterationService {

    private resourceUrl = '/iterationservice/api/iterations';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(iteration: Iteration): Observable<Iteration> {
        const copy = this.convert(iteration);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(iteration: Iteration): Observable<Iteration> {
        const copy = this.convert(iteration);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Iteration> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Iteration.
     */
    private convertItemFromServer(json: any): Iteration {
        const entity: Iteration = Object.assign(new Iteration(), json);
        entity.start = this.dateUtils
            .convertLocalDateFromServer(json.start);
        entity.end = this.dateUtils
            .convertLocalDateFromServer(json.end);
        return entity;
    }

    /**
     * Convert a Iteration to a JSON which can be sent to the server.
     */
    private convert(iteration: Iteration): Iteration {
        const copy: any = Object.assign({}, iteration);
        copy.start = this.convertDateToString(iteration.start);
        copy.end = this.convertDateToString(iteration.end);
        return copy;
    }

    /**
     * Convert a Date to string with format YYYY-MM-DD
     */
    private convertDateToString(date: Date): string {
        var month: string = (date.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        var day: string = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }
        return date.getFullYear() + '-' + month + '-' + day;
    }
}
