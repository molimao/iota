import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocaleContext } from './site/locale';
import { FleetPricing } from './fleet-pricing';
const render = (interval: 'month' | 'year', trialEligible: boolean | undefined) => renderToStaticMarkup(
  <LocaleContext.Provider value="zh"><FleetPricing interval={interval} onIntervalChange={()=>{}} onChoose={()=>{}} allowances={()=>null} signedIn trialEligible={trialEligible} /></LocaleContext.Provider>
);
it('shows a trial only for eligible annual subscriptions', () => {
  const monthly=render('month',true);
  expect(monthly).not.toContain('免费试用 7 天');
  expect(monthly).toContain('每月收取 US$2.99');
  const annual=render('year',true);
  expect(annual).toContain('立即开始 7 天免费试用');
  expect(annual).toContain('7 天后按所选套餐自动续费');
  expect(render('year',false)).not.toContain('免费试用 7 天');
  expect(render('year',false)).toContain('每年一次收取 US$16.99');
});
