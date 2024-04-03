import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
    type: undefined,
    type_color: undefined,
    status: undefined,
    status_color: undefined,
    password: '',
    role: ''
  };
  jobList!: Observable<GestionUtilisateur[]>;
  total: Observable<number>;
  submitted = false;
  filteredList: GestionUtilisateur[] = [];
  selectedRole = '';
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;
  modalRef: BsModalRef<unknown>;

  constructor(private modalService: BsModalService, public service: GestionUtilisateurService, private formBuilder: FormBuilder) {
    this.jobList = service.jobList$;
    this.total = service.total$;
    this.agentForm = this.formBuilder.group({
      firstname: [""],
      lastname: [""],
      phone: [""],
      email: [""],
      password: [""]
    });
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  ngOnInit(): void {
    this.getuserliste();
  }

  getuserliste() {
    this.service.getUserliste().subscribe({
      next: (data) => {
        this.listegestionUser = data;
        //this.filteredList = [...this.listegestionUser];
        //this.filterByRole(); // Appliquer le filtrage initial
      },
      error: console.error
    });
  }

  filterByRole() {
    if (this.selectedRole) {
      this.filteredList = this.listegestionUser.filter(user => user.role === this.selectedRole);
    } else {
      this.filteredList = this.listegestionUser;
    }
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
            this.getuserliste(); // Mettre à jour la liste après la suppression
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
            this.getuserliste(); // Mettre à jour la liste après l'ajout
            this.modalService.hide();
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
        },
        error: console.error
      });
  }
}

  
/*
  modalRef?: BsModalRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  jobListForm!: UntypedFormGroup;
  submitted: boolean = false;

  // Table data
  content?: any;
  lists?: any;
  jobList!: Observable<jobListModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdJobListSortableHeader) headers!: QueryList<NgbdJobListSortableHeader>;
  currentPage: any;

  constructor(private modalService: BsModalService, public service: JobListService, private formBuilder: UntypedFormBuilder) {
    this.jobList = service.jobList$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Jobs' }, { label: 'Jobs List', active: true }];

    
    this.jobListForm = this.formBuilder.group({
      id: "11",
      ids: [''],
      title: ['', [Validators.required]],
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      position: ['', [Validators.required]],
      type: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    
    this.jobList.subscribe(x => {
      this.content = this.lists;
      this.lists = Object.assign([], x);
    });
  }

  
  openViewModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.lists.forEach((x: { state: any; }) => x.state = ev.target.checked)
  }

  // Delete Data
  delete(event: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
          event.target.closest('tr')?.remove();
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }

  
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }

  
  get form() {
    return this.jobListForm.controls;
  }

 
  saveUser() {
    if (this.jobListForm.valid) {
      if (this.jobListForm.get('ids')?.value) {
        this.service.products = JobListdata.map((data: { id: any; }) => data.id === this.jobListForm.get('ids')?.value ? { ...data, ...this.jobListForm.value } : data)
      } else {
        const title = this.jobListForm.get('title')?.value;
        const name = this.jobListForm.get('name')?.value;
        const location = this.jobListForm.get('location')?.value;
        const experience = this.jobListForm.get('experience')?.value;
        const position = this.jobListForm.get('position')?.value;
        const type = this.jobListForm.get('type')?.value;
        const posted_date = "02 June 2021";
        const last_date = "25 June 2021";
        const status = this.jobListForm.get('status')?.value;
        JobListdata.push({
          id: this.lists.length + 1,
          title,
          name,
          location,
          experience,
          position,
          type,
          type_color: "success",
          posted_date,
          last_date,
          status,
          status_color: "success"
        });
      }
    }
    this.modalService.hide();
    setTimeout(() => {
      this.jobListForm.reset();
    }, 2000);
    this.submitted = true
  }

  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Order';
    var updateBtn = document.getElementById('add-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    var listData = this.lists.filter((data: { id: any; }) => data.id === id);
    this.jobListForm.controls['title'].setValue(listData[0].title);
    this.jobListForm.controls['name'].setValue(listData[0].name);
    this.jobListForm.controls['location'].setValue(listData[0].location);
    this.jobListForm.controls['experience'].setValue(listData[0].experience);
    this.jobListForm.controls['position'].setValue(listData[0].position);
    this.jobListForm.controls['type'].setValue(listData[0].type);
    this.jobListForm.controls['status'].setValue(listData[0].status);
    this.jobListForm.controls['ids'].setValue(listData[0].id);
  }

  pageChanged(event: any) {
    this.currentPage = event.page;
  }*/

