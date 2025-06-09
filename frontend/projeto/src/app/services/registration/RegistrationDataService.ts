import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RegistrationDataService {
    private data: any = null;

    setInitialData(data: any) {
        this.data = data;
    }

    getInitialData() {
        return this.data;
    }
}