import { MatDialogConfig } from "@angular/material/dialog";

export class GlobalDialogConfig<D> extends MatDialogConfig<D> {
    override width = '600px';
    override maxWidth = '95vw';
    override maxHeight = '95svh';
} 