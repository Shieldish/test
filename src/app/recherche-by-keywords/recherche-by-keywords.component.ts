import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { FormGroup,FormBuilder, Validators} from '@angular/forms';
import { Chart } from 'chart.js';
import { DataServiceService } from '../data-service.service';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-recherche-by-keywords',
  templateUrl: './recherche-by-keywords.component.html',
  styleUrls: ['./recherche-by-keywords.component.css']
})
export class RechercheByKeywordsComponent implements OnInit {
  

 data3: Array<any> = [];
  page: any;
  aggs1: any;
  doc: any;
  form!: FormGroup;

  // Pagination
  currentPage = 1;
  pageSize    = 9;
  get pagedHits(): any[] {
    const hits: any[] = this.page?.hits?.hits ?? [];
    return hits.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }
  get totalHits(): number  { return this.page?.hits?.hits?.length ?? 0; }
  get totalPages(): number { return Math.ceil(this.totalHits / this.pageSize); }
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++) pages.push(i);
    return pages;
  }
  goToPage(p: number) { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  x1: Array<string> = [];
  y1: Array<number> = [];
  // addresse du serveur elasticsearch
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  h2= this.headers;


  url = environment.elasticsearchUrl;
  
  constructor(private http:HttpClient, private dataservice: DataServiceService, private formbuilder:FormBuilder) { 
    
  }
// initalisation
  ngOnInit() {
    // validation du formulaire
    this.form=this.formbuilder.group({
      keyword:['',Validators.required],
      size:['',Validators.required],

    })
    
    
  }

  //connection à la base et recuperation des données en fonction du mots clés et du nombre de données entré
 
  onSearch(data:any){
    this.doc=''

  //la requette à l'api rest elasticsearch qui envoie des enregistrements concernant un mots clé et aussi les aggregations par date
  this.http.post(this.url,
      {size:data.size,
      query:{
            query_string:{
               query:data.keyword
            }
         },
         
      aggs : {
          nb_par_date : {
              terms: {field : "formattedDateOfPost",size: 1000}
      }}
         },{headers :this.h2})
  //recuperation des données sous forme de fichier json
  .subscribe((data: any)=>{  
    this.doc=data  
    //recuperation des aggregation pour faire les visualisations
    this.aggs1=this.doc.aggregations.nb_par_date.buckets
      this.x1=[]
      this.y1=[]
          for(let i of this.aggs1)
          
          {
            this.x1.push(i.key_as_string)
            this.y1.push(i.doc_count)
          }
    
  })


  
  
  
}
// recuperation des données à afficher
  data(){
    this.page = this.doc;
    this.currentPage = 1;
  }
  //visualisation en forme de ligne

  Visualisation(){
    this.page= new Chart('canvas', {
      type:'line',
      data:{
        //les absices
        labels:this.x1,
        datasets:[
          {
            // les ordonnées
          label:"data",
           data:this.y1,
            borderColor:'rgba(18, 199, 28)',
            backgroundColor:'rgba(11, 107, 84 )',
            borderWidth:4,
            pointBorderWidth:2,
            pointBorderColor:'rgba(11, 107, 84 )',
            pointHoverBackgroundColor:'rgba(255,255,255)',
            
            
           
          },
        ]

      },
      // option de la mise en forme des visualisations
      options:{

        responsive:true,
        legend:{
          position:'top',
          display:true
        },
        title:{
          display:true,
          text:'Visualisation des données en fonctions des dates',
          fontSize:20
        },
        scales:{
          xAxes:[{
            display:false,
          }],
          yAxes: [{
            display:true,
            ticks: {
              beginAtZero: true,
              fontColor:'rgba(11, 107, 84 )',
              
            }
          }]

        }
        
      }

    })
    
    
  }
  // telechargement des données en csv
  fileDowload(){
  this.data3=[]
  // recupérer les données et les mettre dans un tableau 
  for(let i of this.doc?.hits?.hits)
   
  {
    this.data3.push({
    IdOwner:i._source.idOwner,
    IdPost:i._source.idPost,
    DateOfInsertion:i._source.dateOfInsertion,
    DateOfPost:i._source.dateOfPost,
    FormattedDateOfPost:i._source.formattedDateOfPost,
    LangPost:i._source.langPost,
    Content:i._source.content,
    TreatedPost:i._source.treatedPost,
    UrlPost:i._source.urlPost,
    WebsiteUrl:i._source.websiteUrl,
    });
  }
  // option de la mise en forme du fichier csv à telecharger
  var options = { 
    fieldSeparator : ',' , 
    quoteString:'"',
    decimalseparator : '.' ,
    useBom:true,
    headers: ["IdOwner","IdPost","DateOfInsertion","DateOfPost", "FormattedDateOfPost"," LangPost",,"Content","TreatedPost","UrlPost","WebsiteUrl"],
    useHeaders:true,
    nullToEmptyString: true,
    
  };
// fonction csv
// new AngularCsv(this.data3, "report",options);
new AngularCsv(this.data3, "Data-"+this.getDate1()+"-"+this.getCurrentTime(),options);

}

     getDownloadStatus()
     {  let t= this.dataservice.getTel()
         if(t=='1')
         {
           return true
         }
         return false;

     }
     getDate1()
     { let d =formatDate(new Date(), 'yyyy/MM/dd', 'en')
       return d;
     }
   

     getCurrentTime() {
      let today = new Date();
      let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
      let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
      let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
      return hours + '-' + minutes + '-' + seconds;
     }

}
