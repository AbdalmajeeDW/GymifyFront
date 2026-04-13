
// components/GymBarChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  type?: 'vertical' | 'horizontal';
  stacked?: boolean;
}

export default function GymBarChart({ 
  data, 
  title = '', 
  type = 'vertical',
  stacked = false 
}: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: type === 'horizontal' ? 'bar' : 'bar',
        data: data,
        options: {
          indexAxis: type === 'horizontal' ? 'y' : 'x',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: !!title,
              text: title,
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 30
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: stacked,
              grid: {
                display: false
              }
            },
            y: {
              stacked: stacked,
              beginAtZero: true,
              ticks: {
                stepSize: type === 'horizontal' ? undefined : 10
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, type, stacked]);

  return (
    <div >
      <canvas style={{height:'237px',width:'437.9px'}} ref={chartRef} />
    </div>
  );
}