import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { GestionUtilisateur } from './list.model';
import { GestionUtilisateurService } from './list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [GestionUtilisateurService]
})

export class GestionUtilisateurComponent implements OnInit {
  agentForm: FormGroup;
  listegestionUser!: GestionUtilisateur[];
  gestionUserbyid: GestionUtilisateur = {
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    type: undefined,
    type_color: undefined,
    status_color: undefined,
    status: 'success'
  };
  gestionUtilisateur!: Observable<GestionUtilisateur[]>;
  total: Observable<number>;
  submitted = false;
  selectedStatut = '';
  selectedRole = '';

  @ViewChild('addContent') addContent: TemplateRef<any>;
  @ViewChild('updateContent') updateContent: TemplateRef<any>;
  @ViewChild('viewContent') viewContent: TemplateRef<any>;

  modalRef: BsModalRef<unknown>;
  currentPage: any;
  selectedAgent: GestionUtilisateur | undefined;

  constructor(private modalService: BsModalService, public service: GestionUtilisateurService, private formBuilder: FormBuilder) {
    this.total = service.total$;
    this.agentForm = this.formBuilder.group({
      id: [null],
      firstname: [''],
      lastname: [''],
      phone: [''],
      email: [''],
      password: ['']
    });
  }

  openViewModal(data: GestionUtilisateur) {
    this.selectedAgent = data;
    this.modalRef = this.modalService.show(this.viewContent, { class: 'modal-md' });
  }

  openAddModal() {
    this.submitted = false;
    this.modalRef = this.modalService.show(this.addContent, { class: 'modal-md' });
  }

  openUpdateModal(data: GestionUtilisateur) {
    this.submitted = false;
    this.agentForm.patchValue(data);
    this.modalRef = this.modalService.show(this.updateContent, { class: 'modal-md' });
  }

  ngOnInit(): void {
    this.getuserliste();
  }

  getuserliste() {
    this.service.getUserliste().subscribe({
      next: (data) => {
        this.listegestionUser = data;
      },
      error: console.error
    });
  }

  deleteuser(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delateUser(id)
          .subscribe(res => {
            this.getuserliste();
          });
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe 🙂',
          'error'
        );
      }
    });
  }

  adduser(): void {
    if (!this.submitted) {
      this.service.addUser(this.agentForm.value)
        .subscribe({
          next: (res) => {
            this.getuserliste();
            this.modalRef.hide();
          }
        });
    }
  }

  updateuser(): void {
    const idToUpdate = this.agentForm.get('id')?.value;
    if (!this.submitted && idToUpdate) {
      this.service.updateUser(idToUpdate, this.agentForm.value)
        .subscribe({
          next: (res) => {
            this.getuserliste();
            this.modalRef.hide();
          }
        });
    }
  }
  userdetail(id: number): void {
    this.service.userbyid(id)
      .subscribe({
        next: (data) => {
          this.gestionUserbyid = data;
          console.log("TESTTTT");
          console.log(data);
          // Vérifiez si data contient la propriété isEnabled et affectez-la à gestionUserbyid
          if ('isEnabled' in data) {
            this.gestionUserbyid.isEnabled = data.isEnabled;
          }
        },
        error: console.error
      });
  }
  

  pageChanged(event: any) {
    this.currentPage = event.page;
  }
}
