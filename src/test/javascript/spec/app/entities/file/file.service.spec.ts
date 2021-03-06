/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { FileService } from 'app/entities/file/file.service';
import { IFile, File, FileType } from 'app/shared/model/file.model';

describe('Service Tests', () => {
    describe('File Service', () => {
        let injector: TestBed;
        let service: FileService;
        let httpMock: HttpTestingController;
        let elemDefault: IFile;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(FileService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new File(0, 'AAAAAAA', 'AAAAAAA', currentDate, 'AAAAAAA', FileType.IDPROOF);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        updatedDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a File', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        updatedDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        updatedDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new File(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a File', async () => {
                const returnedFromService = Object.assign(
                    {
                        fileURL: 'BBBBBB',
                        name: 'BBBBBB',
                        updatedDate: currentDate.format(DATE_TIME_FORMAT),
                        mimeType: 'BBBBBB',
                        type: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        updatedDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of File', async () => {
                const returnedFromService = Object.assign(
                    {
                        fileURL: 'BBBBBB',
                        name: 'BBBBBB',
                        updatedDate: currentDate.format(DATE_TIME_FORMAT),
                        mimeType: 'BBBBBB',
                        type: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        updatedDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(take(1), map(resp => resp.body))
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a File', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
