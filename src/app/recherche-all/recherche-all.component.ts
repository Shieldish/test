import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Chart } from 'chart.js';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recherche-all',
  templateUrl: './recherche-all.component.html',
  styleUrls: ['./recherche-all.component.css']
})
export class RechercheAllComponent implements OnInit {

  // Donnees brutes
  page: any;
  doc: any;
  loading = true;
  error = false;

  // Pagination données brutes
  currentPage  = 1;
  pageSize     = 10;
  get pagedHits(): any[] {
    const hits: any[] = this.page?.hits?.hits ?? [];
    const start = (this.currentPage - 1) * this.pageSize;
    return hits.slice(start, start + this.pageSize);
  }
  get totalHits(): number { return this.page?.hits?.hits?.length ?? 0; }
  get totalPages(): number { return Math.ceil(this.totalHits / this.pageSize); }
  get pageNumbers(): number[] {
    const total = this.totalPages;
    const cur   = this.currentPage;
    const delta = 2;
    const pages: number[] = [];
    for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
      pages.push(i);
    }
    return pages;
  }
  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) this.currentPage = p;
  }

  // Agrégations
  aggs_lang:  any[] = [];
  aggs_year:  any[] = [];
  aggs_month: any[] = [];
  aggs_lang_year: any[] = [];

  // Séries pour chaque graphique
  langLabels:  string[] = [];
  langCounts:  number[] = [];
  yearLabels:  string[] = [];
  yearCounts:  number[] = [];
  monthLabels: string[] = [];
  monthCounts: number[] = [];

  // Stats résumé
  totalDocs = 0;
  langCount = 0;
  dateMin = '';
  dateMax = '';

  // Active chart selection
  activeChart: string = 'doughnut';

  readonly CHART_TABS: { id: string; label: string; icon: string }[] = [
    { id: 'doughnut', label: 'Langues',          icon: 'donut_large' },
    { id: 'bar',      label: 'Par année',         icon: 'bar_chart' },
    { id: 'line',     label: 'Tendance',          icon: 'show_chart' },
    { id: 'polar',    label: 'Aire polaire',      icon: 'radar' },
    { id: 'hbar',     label: 'Barres horiz.',     icon: 'align_horizontal_left' },
    { id: 'stacked',  label: 'Empilé',            icon: 'stacked_bar_chart' },
  ];

  // Instances Chart.js
  chartDoughnut:    any;
  chartBar:         any;
  chartLine:        any;
  chartPolar:       any;
  chartHBar:        any;
  chartStacked:     any;

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  h2 = this.headers;
  url = environment.elasticsearchUrl;

  // Couleurs par langue
  readonly LANG_COLORS: Record<string, string> = {
    fr: 'rgba(37,99,235,0.85)',
    en: 'rgba(22,163,74,0.85)',
    ar: 'rgba(217,119,6,0.85)',
    fa: 'rgba(124,58,237,0.85)',
  };
  readonly LANG_COLORS_LIGHT: Record<string, string> = {
    fr: 'rgba(37,99,235,0.2)',
    en: 'rgba(22,163,74,0.2)',
    ar: 'rgba(217,119,6,0.2)',
    fa: 'rgba(124,58,237,0.2)',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAggregations();
  }

  fetchAggregations() {
    this.loading = true;
    this.error = false;

    this.http.post<any>(this.url, {
      size: 0,
      aggs: {
        nb_par_lang: {
          terms: { field: 'langPost', size: 20 }
        },
        nb_par_annee: {
          date_histogram: { field: 'formattedDateOfPost', calendar_interval: 'year', format: 'yyyy' }
        },
        nb_par_mois: {
          date_histogram: { field: 'formattedDateOfPost', calendar_interval: 'month', format: 'yyyy-MM' }
        },
        lang_par_annee: {
          terms: { field: 'langPost', size: 10 },
          aggs: {
            years: { date_histogram: { field: 'formattedDateOfPost', calendar_interval: 'year', format: 'yyyy' } }
          }
        },
        date_stats: { stats: { field: 'formattedDateOfPost' } }
      }
    }, { headers: this.h2 })
      .pipe(map(r => r))
      .subscribe({
        next: (data: any) => {
          this.totalDocs = data.hits.total.value;

          this.aggs_lang  = data.aggregations.nb_par_lang.buckets;
          this.aggs_year  = data.aggregations.nb_par_annee.buckets;
          this.aggs_month = data.aggregations.nb_par_mois.buckets;
          this.aggs_lang_year = data.aggregations.lang_par_annee.buckets;

          const stats = data.aggregations.date_stats;
          this.dateMin = stats.min_as_string?.substring(0, 10) ?? '';
          this.dateMax = stats.max_as_string?.substring(0, 10) ?? '';

          this.langLabels = this.aggs_lang.map((b: any) => b.key.toUpperCase());
          this.langCounts = this.aggs_lang.map((b: any) => b.doc_count);
          this.langCount  = this.aggs_lang.length;

          this.yearLabels  = this.aggs_year.map((b: any) => b.key_as_string);
          this.yearCounts  = this.aggs_year.map((b: any) => b.doc_count);

          this.monthLabels = this.aggs_month.map((b: any) => b.key_as_string);
          this.monthCounts = this.aggs_month.map((b: any) => b.doc_count);

          this.loading = false;

          setTimeout(() => this.buildAllCharts(), 0);
        },
        error: () => {
          this.loading = false;
          this.error = true;
        }
      });
  }

  onSearchAll() {
    if (this.doc) return;
    this.http.post<any>(this.url, { size: 1000 }, { headers: this.h2 })
      .subscribe((data: any) => {
        this.doc = data;
        this.page = data;
        this.currentPage = 1;
      });
  }

  // ── Chart tab selection ──────────────────────────────────────────────────

  selectChart(id: string) {
    this.activeChart = id;
    setTimeout(() => this.buildActiveChart(), 0);
  }

  buildActiveChart() {
    this.destroyAll();
    switch (this.activeChart) {
      case 'doughnut': this.buildDoughnut(); break;
      case 'bar':      this.buildBar();      break;
      case 'line':     this.buildLine();     break;
      case 'polar':    this.buildPolar();    break;
      case 'hbar':     this.buildHBar();     break;
      case 'stacked':  this.buildStacked();  break;
    }
  }

  // ── Build all charts ─────────────────────────────────────────────────────

  buildAllCharts() {
    this.buildActiveChart();
  }

  destroyAll() {
    [this.chartDoughnut, this.chartBar, this.chartLine,
     this.chartPolar, this.chartHBar, this.chartStacked]
      .forEach(c => { try { c?.destroy(); } catch (_) {} });
  }

  buildDoughnut() {
    const colors = this.aggs_lang.map((b: any) =>
      this.LANG_COLORS[b.key] ?? this.randomColor(b.key));
    this.chartDoughnut = new Chart('cChart', {
      type: 'doughnut',
      data: {
        labels: this.langLabels,
        datasets: [{ data: this.langCounts, backgroundColor: colors, borderWidth: 3, borderColor: '#fff', hoverBorderWidth: 5 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom', labels: { padding: 16, boxWidth: 14, fontFamily: 'Inter, sans-serif' } },
        title: { display: false },
        cutoutPercentage: 62,
        tooltips: { callbacks: {
          label: (item: any, data: any) => {
            const v = data.datasets[0].data[item.index];
            const pct = ((v / this.totalDocs) * 100).toFixed(1);
            return ` ${data.labels[item.index]}: ${v} docs (${pct}%)`;
          }
        }}
      }
    });
  }

  buildBar() {
    this.chartBar = new Chart('cChart', {
      type: 'bar',
      data: {
        labels: this.yearLabels,
        datasets: [{
          label: 'Documents',
          data: this.yearCounts,
          backgroundColor: 'rgba(37,99,235,0.75)',
          borderColor: 'rgba(37,99,235,1)',
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(37,99,235,1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        title: { display: false },
        scales: {
          xAxes: [{ gridLines: { display: false }, ticks: { fontFamily: 'Inter, sans-serif' } }],
          yAxes: [{ ticks: { beginAtZero: true, fontFamily: 'Inter, sans-serif' }, gridLines: { color: 'rgba(0,0,0,0.06)' } }]
        }
      }
    });
  }

  buildLine() {
    this.chartLine = new Chart('cChart', {
      type: 'line',
      data: {
        labels: this.monthLabels,
        datasets: [{
          label: 'Documents / mois',
          data: this.monthCounts,
          borderColor: 'rgba(22,163,74,1)',
          backgroundColor: 'rgba(22,163,74,0.1)',
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(22,163,74,1)',
          pointHoverRadius: 6,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{ ticks: { maxTicksLimit: 12, fontFamily: 'Inter, sans-serif' }, gridLines: { display: false } }],
          yAxes: [{ ticks: { beginAtZero: true, fontFamily: 'Inter, sans-serif' }, gridLines: { color: 'rgba(0,0,0,0.06)' } }]
        }
      }
    });
  }

  buildPolar() {
    const colors = this.aggs_lang.map((b: any) =>
      this.LANG_COLORS[b.key] ?? this.randomColor(b.key));
    this.chartPolar = new Chart('cChart', {
      type: 'polarArea',
      data: {
        labels: this.langLabels,
        datasets: [{
          data: this.langCounts,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom', labels: { padding: 14, boxWidth: 14, fontFamily: 'Inter, sans-serif' } },
        scale: { ticks: { beginAtZero: true } }
      }
    });
  }

  buildHBar() {
    const colors = this.aggs_lang.map((b: any) =>
      this.LANG_COLORS[b.key] ?? this.randomColor(b.key));
    this.chartHBar = new Chart('cChart', {
      type: 'horizontalBar',
      data: {
        labels: this.langLabels,
        datasets: [{
          label: 'Documents',
          data: this.langCounts,
          backgroundColor: colors,
          borderWidth: 0,
          hoverBackgroundColor: colors.map(c => c.replace('0.85', '1'))
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{ ticks: { beginAtZero: true, fontFamily: 'Inter, sans-serif' }, gridLines: { color: 'rgba(0,0,0,0.06)' } }],
          yAxes: [{ gridLines: { display: false }, ticks: { fontFamily: 'Inter, sans-serif' } }]
        }
      }
    });
  }

  buildStacked() {
    // One dataset per language, X axis = years
    const datasets = this.aggs_lang_year.map((langBucket: any) => {
      const key = langBucket.key;
      const yearMap: Record<string, number> = {};
      langBucket.years.buckets.forEach((yb: any) => { yearMap[yb.key_as_string] = yb.doc_count; });
      return {
        label: key.toUpperCase(),
        data: this.yearLabels.map(y => yearMap[y] ?? 0),
        backgroundColor: this.LANG_COLORS[key] ?? this.randomColor(key),
        borderWidth: 0
      };
    });

    this.chartStacked = new Chart('cChart', {
      type: 'bar',
      data: { labels: this.yearLabels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom', labels: { padding: 14, boxWidth: 14, fontFamily: 'Inter, sans-serif' } },
        scales: {
          xAxes: [{ stacked: true, gridLines: { display: false }, ticks: { fontFamily: 'Inter, sans-serif' } }],
          yAxes: [{ stacked: true, ticks: { beginAtZero: true, fontFamily: 'Inter, sans-serif' }, gridLines: { color: 'rgba(0,0,0,0.06)' } }]
        }
      }
    });
  }

  randomColor(seed: string): string {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
    return `hsla(${Math.abs(h) % 360},65%,52%,0.85)`;
  }
}
