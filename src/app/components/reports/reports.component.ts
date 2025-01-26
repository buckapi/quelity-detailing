import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { RealtimeActivitiesWorkInstructionsService } from '../../services/realtime-activitiesWorkInstruction.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  constructor(
    public global: GlobalService,
    public activityService: RealtimeActivitiesWorkInstructionsService
  ) {}

  ngOnInit() {
    this.loadActivities();
  }

  async loadActivities() {
    try {
      const activities = await this.activityService.getActivities();
      const data = this.processActivities(activities);
      this.renderChart(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  }

  processActivities(activities: any[]) {
    const groupedByDay = activities.reduce((acc, activity) => {
      const date = new Date(activity.time).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(groupedByDay),
      data: Object.values(groupedByDay) as number[]
    };
  }

 /*  renderChart(data: { labels: string[], data: number[] }) {
    new Chart('revenueGenerateChart', {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Activities',
          data: data.data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } */
  renderChart(data: { labels: string[], data: number[] }) {
    new Chart('revenueGenerateChart', { // Asegúrate de que el ID coincida
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Activities',
          data: data.data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}