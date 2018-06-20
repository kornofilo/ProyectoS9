import { Component, OnInit, OnDestroy } from '@angular/core';
declare let $: any;
import { FormGroup, Form } from '@angular/forms';
import { MetodosEnvio } from '../../classes/metodos-envio';
import { Envios } from '../../classes/envios';
import { Subscription } from 'rxjs';

// Firebase
import { AuthService } from '../../services/auth.service';

// Servicios
import { FirestoreMetodosEnvioService } from '../../services/firestore-metodos-envio.service';
import { FirestoreEnviosService } from '../../services/firestore-envios.service';

@Component({
  selector: 'app-oficina-envios',
  templateUrl: './oficina-envios.component.html',
  styleUrls: ['./oficina-envios.component.css']
})
export class OficinaEnviosComponent implements OnInit, OnDestroy {
  formAddEnvio: Form;
  addPaqueteForm: FormGroup;
  arr: Envios[] = [];
  arrMetodosEnvio: MetodosEnvio[] = [];
  metodosEnvioOptions: ['Sierra', 'Hotel', 'Indie'];
  newEnvio: Envios;
  idEnvio: string;
  modelPaquete = { numTracking: 0, remitente: {nombre: '', apellido: '', telefono: ''},
  destinatario: {nombre: '', apellido: '', telefono: '', direccion: ''},
  origen: '', fechaEnvio: '', tipoEnvio: this.arrMetodosEnvio[0], descripcion: '', dimensiones: {largo: 0} ,
  perecedero : false};

  modelDocumento = { numTracking: 0, remitente: {nombre: '', apellido: '', telefono: ''},
  destinatario: {nombre: '', apellido: '', telefono: '', direccion: ''},
  origen: '', fechaEnvio: '', tipoEnvio: '', descripcion: ''};

  private firestoreSubscription: Subscription;
  constructor(public authService: AuthService, public _data: FirestoreEnviosService,
    public _misMetodosDeEnvio: FirestoreMetodosEnvioService) {}

  // Suscripciones
  private firestoreEnviosSubscription: Subscription;
  private firestoreMetodosEnvioSubscription: Subscription;

  ngOnInit() {
    this.firestoreEnviosSubscription = this._data.getEnvios().subscribe(
      (oficina: Envios[]) => {
      this.arr = oficina;
      console.log(this.arr);
     }
    );

    /* this.firestoreMetodosEnvioSubscription = this._misMetodosDeEnvio.getMetodosEnvio().subscribe(
      (metodosEnvio: MetodosEnvio[]) => {
        this.arrMetodosEnvio = metodosEnvio;
      }
    ); */

    $('select').formSelect();
    $('.modal').modal();
    $('.datepicker').datepicker({
        container: 'body'
      });
    $('input#input_text, textarea#textarea2').characterCounter();

  }

  ngOnDestroy() {
    this.firestoreEnviosSubscription.unsubscribe();
    this.firestoreMetodosEnvioSubscription.unsubscribe();
  }

}
