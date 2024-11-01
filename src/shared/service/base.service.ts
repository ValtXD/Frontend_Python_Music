import { HttpClient, HttpParams, HttpUserEvent } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../../dto/paginated-result';
import { ParametersFilter } from '../filter/filter.component';

export class BaseService<T> {
    public urlBase: string;
    public urlSocket: string;
    public fullUrl: string;

    private parameters: HttpParams = new HttpParams();

    constructor(
        public http: HttpClient,
        public path: string
    ) {
        this.urlBase = environment.urlBase;
        this.urlSocket = environment.urlSocket;
        this.fullUrl = `${this.urlBase}${path}`;
    }

    public clearParameter(): void {
        this.parameters = new HttpParams();
    }

    public setParameter(params?: HttpParams) {
        this.parameters = params;
    }

    public addParameter(key: string, value: any): void {
        this.parameters = this.parameters.append(key, value);
    }

    public addParameters(params: ParametersFilter): void {
        Object.keys(params).forEach((key) => {
            this.parameters = this.parameters.append(key, params[key]);
        });
    }

    private getOptions(responseType?: any): any {
        const httpOptions = {};

        if (this.parameters) {
            httpOptions['params'] = this.parameters;
        }
        if (responseType) {
            httpOptions['responseType'] = responseType;
        }
        return httpOptions;
    }

    public getAll(route?: string): Observable<T[]> {
        const url = route ? `${this.fullUrl}${route}/` : `${this.fullUrl}`;
        return this.http.get<T[]>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<T[]>),
            catchError(() => from([]))
        );
    }

    public getPaginated(route?: string): Observable<PaginatedResult<T>> {
        const url = route ? `${this.fullUrl}${route}/` : `${this.fullUrl}`;
        return this.http.get<PaginatedResult<T>>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<PaginatedResult<T>>),
            catchError(() => from([]))
        );
    }

    public getPaginatedFromDetailRoute<K>(id: number | string, route: string): Observable<PaginatedResult<K>> {
        let url = '';
        if (id === null) {
            url = `${this.fullUrl}${route}/`;
        } else {
            url = `${this.fullUrl}${id}/${route}/`;
        }
        return this.http.get<PaginatedResult<K>>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<PaginatedResult<K>>),
            catchError(() => from([]))
        );
    }

    public getPaginatedFromListRoute<K>(route: string): Observable<PaginatedResult<K>> {
        const url = `${this.fullUrl}${route}/`;
        return this.http.get<PaginatedResult<K>>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<PaginatedResult<K>>),
            catchError(() => from([]))
        );
    }

    public getFromDetailRoute<K>(id: number, route: string): Observable<K> {
        const url = `${this.fullUrl}${id}/${route}/`;
        return this.http.get<K>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public getFromListRoute<K>(route: string): Observable<K> {
        const url = `${this.fullUrl}${route}/`;
        return this.http.get<K>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public postFromDetailRoute<E, K>(id: number, route: string, entity: E): Observable<K> {
        const url = `${this.fullUrl}${id}/${route}/`;
        return this.http.post<K>(url, entity, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public postFromListRoute<E, K>(route: string, entity: E): Observable<K> {
        const url = `${this.fullUrl}${route}/`;
        return this.http.post<K>(url, entity, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public patchFromDetailRoute<E, K>(id: number, route: string, entity: E): Observable<K> {
        const url = `${this.fullUrl}${id}/${route}/`;
        return this.http.patch<K>(url, entity, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public patchFromListRoute<E, K>(route: string, entity: E): Observable<K> {
        const url = `${this.fullUrl}${route}/`;
        return this.http.patch<K>(url, entity, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public save(entity: T): Observable<T> {
        this.clearParameter();
        return this.http.post<T>(this.fullUrl, entity, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<T>),
            catchError(() => from([]))
        );
    }

    public getById(id: number | string, route?: string): Observable<T> {
        const url = route ? `${this.fullUrl}${id}/${route}/` : `${this.fullUrl}${id}/`;
        return this.http.get<T>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<T>),
            catchError(() => from([]))
        );
    }

    public getByUrl(url: string): Observable<T> {
        return this.http.get<T>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<T>),
            catchError(() => from([]))
        );
    }

    public delete(id: number | string): Observable<any> {
        this.clearParameter();
        const url = `${this.fullUrl}${id}/`;
        return this.http.delete<any>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<any>),
            catchError(() => from([]))
        );
    }

    public deleteFromListRoute<K>(route: string, ids: number[]): Observable<K> {
        const url = `${this.fullUrl}${route}/?ids=${ids.join(',')}`;
        return this.http.delete<K>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<K>),
            catchError(() => from([]))
        );
    }

    public update(id: number | string, entity: any): Observable<any> {
        this.clearParameter();
        const url = `${this.fullUrl}${id}/`;
        return this.http.patch<T>(url, entity, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<T>),
            catchError((ex) => throwError(ex))
        );
    }

    public options(): Observable<any> {
        return this.http.options<T>(this.fullUrl, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<any>),
            map((response) => response['actions']['POST']),
            catchError(() => from([]))
        );
    }

    public getChoices(field: string): Observable<any> {
        return this.http.options<any>(this.fullUrl, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<any>),
            map((response) => response['actions']['POST'][field]['choices']),
            catchError(() => from([]))
        );
    }

    public webSocketConnect<K>(path: string): Observable<K> {
        let url = `${this.urlSocket}/${path}/`;
        if (this.parameters.toString()) {
            url = `${url}?${this.parameters.toString()}`;
        }
        return webSocket<K>(url);
    }

    public loadUrl(url: string): Observable<T> {
        return this.http.get<T>(url, this.getOptions()).pipe(
            tap((response) => response as HttpUserEvent<T>),
            catchError(() => from([]))
        );
    }

    public loadFile(route: string, data: any): Observable<Blob> {
        const url = `${this.fullUrl}${route}/`;
        return this.http.post<Blob>(url, data, this.getOptions('blob')).pipe(
            tap((response) => response),
            catchError(() => from([]))
        );
    }

    public getParameters(): HttpParams {
        return this.parameters;
    }

    public getFileFromListRoute(route: string): Observable<Blob> {
        const url = `${this.fullUrl}${route}/`;
        return this.http.get<Blob>(url, this.getOptions('blob')).pipe(
            tap((response) => response),
            catchError((ex) => from([]))
        );
    }
}
