import { DEFAULT_PACKAGES } from '../src/domain/packages';
import { DEFAULT_PLATFORM_PRESETS } from '../src/domain/platform-presets';
import { DEFAULT_SALES_CHANNELS } from '../src/domain/sales-channels';

if (DEFAULT_PACKAGES.length < 5) throw new Error('Expected default packages.');
if (DEFAULT_PLATFORM_PRESETS.length < 5) throw new Error('Expected default presets.');
if (DEFAULT_SALES_CHANNELS.length < 5) throw new Error('Expected default sales channels.');

console.log('Smoke checks passed for domain defaults.');
