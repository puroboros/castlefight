import { Observable } from "rxjs";
import { View } from "../view/view";

export class Match {
    constructor(private input: Observable<any>, private view: View){
        input.subscribe(event => {
            console.log('pepino: ' + event);
        });
    }
    
}
