import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

type Theme = 'light' | 'dark';
type Density = 'compact' | 'default' | 'comfortable';

interface Metric {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}
interface ClientRow {
  readonly client: string;
  readonly coordinator: string;
  readonly status: 'Active' | 'Pending' | 'Review';
  readonly due: string;
}

/**
 * Figma-backed dashboard proving that Angular components can consume a
 * prefix-free semantic token contract without embedding visual values.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  readonly themes: readonly Theme[] = ['light', 'dark'];
  readonly densities: readonly Density[] = ['compact', 'default', 'comfortable'];

  readonly metrics: readonly Metric[] = [
    { label: 'Active clients', value: '128', detail: '+8 this month' },
    { label: 'Pending reviews', value: '12', detail: '4 due today' },
    { label: 'Monthly revenue', value: '$12.4k', detail: '+6.2% vs last month' }
  ];

  readonly clients: readonly ClientRow[] = [
    { client: 'Acme Health', coordinator: 'Maya Chen', status: 'Active', due: 'Today' },
    { client: 'Northwind Care', coordinator: 'Jordan Lee', status: 'Pending', due: 'Tomorrow' },
    { client: 'Harmony Home', coordinator: 'Priya Shah', status: 'Review', due: 'Jul 18' },
    { client: 'Sunrise Support', coordinator: 'Alex Morgan', status: 'Active', due: 'Jul 22' }
  ];

  theme: Theme = 'light';
  density: Density = 'default';

  constructor() {
    this.applyPreferences();
  }

  /** Updates the global theme contract; components remain style-value agnostic. */
  setTheme(theme: string): void {
    if (theme === 'light' || theme === 'dark') {
      this.theme = theme;
      this.applyPreferences();
    }
  }

  /** Updates only the density attribute consumed by semantic tokens. */
  setDensity(density: string): void {
    if (density === 'compact' || density === 'default' || density === 'comfortable') {
      this.density = density;
      this.applyPreferences();
    }
  }

  private applyPreferences(): void {
    const root = this.document.documentElement;
    root.dataset['theme'] = this.theme;
    root.dataset['density'] = this.density;
  }
}
