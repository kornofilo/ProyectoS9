import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Transporte } from '../../classes/transporte';
import { Envios } from '../../classes/envios';
declare let $: any;
// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { AuthService } from '../../services/auth.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { Form,FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FirestoreEnviosService } from '../../services/firestore-envios.service';
import { FirestoreTransportesEnvioService} from '../../services/firestore-transportes-envio.service';
@Component({
  selector: 'app-operaciones-asigtransporte',
  templateUrl: './operaciones-asigtransporte.component.html',
  styleUrls: ['./operaciones-asigtransporte.component.css']
})
export class OperacionesAsigtransporteComponent implements OnInit, OnDestroy, OnChanges {
  arrTransporte:Transporte [] = [];
  arr: Envios[] = [];
    transporte: string;
    updClicked = false;
    iME: string;
    // Elementos del Form
    crearTransporteform: FormGroup;

private firebaseEnvioSubscription: Subscription;
    private firestoreTransportesSubscription: Subscription;

  constructor(public authService: AuthService ,public _misTransporte: FirestoreTransportesEnvioService,  public route: ActivatedRoute
    , public _miDestino:  FirestoreEnviosService,private fb: FormBuilder,
  ) {}

  ngOnInit() {
      this.transporte = this.route.snapshot.params['transporte'];
    console.log(this.transporte);
    // Obtenemos los transporte registradas en la base de datos.
    this.firestoreTransportesSubscription = this._misTransporte.getTransporteType(this.transporte).subscribe(
    (transporte: Transporte[]) => {
    this.arrTransporte = transporte;
      console.log(this.arrTransporte);
     }
    );
    // Obtenemos los Transportes
    this.firebaseEnvioSubscription = this._miDestino.getEnvios().subscribe(
      (envios: Envios[]) => {
      this.arr = envios;
        }
    );
    // Inicialización de los elementos de Materialize que requieren JQuery para su funcionamiento.
    $(function() {
      $('select').formSelect();
        $('.modal').modal();
      $('.timepicker').timepicker({
        twelveHour:	false,
        container: 'body'
      });
        });
        this.createForm();
  }
  // Finalizamos la suscripción con el servicio al cerrar el componente.
  ngOnDestroy() {
    this.firestoreTransportesSubscription.unsubscribe();
      this.firebaseEnvioSubscription.unsubscribe();
  }
  ngOnChanges() {
    this.cleanForm();
  }
  createForm() {
    this.crearTransporteform = this.fb.group({
      destinoAsig: ['', Validators.required],
      estado: 'cargado',
    });
  }
  cleanForm() {
this.crearTransporteform.reset();
}


  onUpdate(transp) {
    this.iME = transp.id;
    this.updClicked = true;
    this.crearTransporteform.patchValue({
     destinoAsig: transp.destinoAsig,
     estado: 'cargado',
    });
  }

  updateSubmit() {
    this._misTransporte.updateTransporte(this.iME, this.crearTransporteform.value);
    this.cleanForm();
  }
}