import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Iteration } from './iteration.model';
import { IterationService } from './iteration.service';

@Injectable()
export class IterationPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private iterationService: IterationService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.iterationService.find(id).subscribe((iteration) => {
                    if (iteration.start) {
                        iteration.start = {
                            year: iteration.start.getFullYear(),
                            month: iteration.start.getMonth() + 1,
                            day: iteration.start.getDate()
                        };
                    }
                    if (iteration.end) {
                        iteration.end = {
                            year: iteration.end.getFullYear(),
                            month: iteration.end.getMonth() + 1,
                            day: iteration.end.getDate()
                        };
                    }
                    this.ngbModalRef = this.iterationModalRef(component, iteration);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.iterationModalRef(component, new Iteration());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    iterationModalRef(component: Component, iteration: Iteration): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.iteration = iteration;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
