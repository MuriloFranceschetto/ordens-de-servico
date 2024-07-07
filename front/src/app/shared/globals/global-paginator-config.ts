import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {

    changes = new Subject<void>();
    nextPageLabel: string = 'Próxima página';
    previousPageLabel: string = 'Voltar página';
    itemsPerPageLabel: string = 'Itens por página';
    firstPageLabel: string = 'Primeira página';
    lastPageLabel: string = 'Última página';

    getRangeLabel(page: number, pageSize: number, length: number) {
        if (length === 0) {
            return `Página 1 de 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Página ${page + 1} de ${amountPages}`;
    }

}