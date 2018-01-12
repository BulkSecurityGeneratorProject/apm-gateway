import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SprintTeam } from './sprint-team.model';

@Injectable()
export class SprintTeamService {

    private resourceUrl = '/iterationservice/api/sprint-teams';

    constructor(private http: Http) { }

    create(sprintTeam: SprintTeam): Observable<SprintTeam> {
        const copy = this.convert(sprintTeam);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(sprintTeam: SprintTeam): Observable<SprintTeam> {
        // TODO: implement - necessary for updating people in a SprintTeam
        return null;
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    /**
     * Convert a returned JSON object to SprintTeam.
     */
    private convertItemFromServer(json: any): SprintTeam {
        const entity: SprintTeam = Object.assign(new SprintTeam(), json);
        return entity;
    }

    /**
     * Convert a SprintTeam to a JSON which can be sent to the server.
     */
    private convert(sprintTeam: SprintTeam): SprintTeam {
        const copy: SprintTeam = Object.assign({}, sprintTeam);
        return copy;
    }
}
