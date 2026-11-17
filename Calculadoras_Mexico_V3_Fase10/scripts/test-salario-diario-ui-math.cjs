'use strict';
const assert=require('node:assert/strict');
const {calculate}=require('../assets/js/salario-diario.js');
let cases=0;
for(const [period,divisor] of Object.entries({mensual:30,quincenal:15,semanal:7,diario:1})) {
  for(const amount of [.01,500,2300,2500,9000,15000,1e12]) {
    const r=calculate(amount,period), daily=amount/divisor;
    for(const [key,expected] of Object.entries({daily,weekly:daily*7,quincenal:daily*15,monthly30:daily*30,monthly365:daily*365/12,monthly52:daily*7*52/12,fourWeeklyPayments:daily*7*4,fiveWeeklyPayments:daily*7*5})) assert.equal(r[key],expected);
    cases++;
  }
}
for(const value of [0,-1,NaN,Infinity,1e12+1,'2300',null]) assert.throws(()=>calculate(value,'mensual'));
for(const period of ['invalid','__proto__','toString']) assert.throws(()=>calculate(100,period));
assert.equal(calculate(2300,'semanal').monthly30.toFixed(2),'9857.14');
console.log(JSON.stringify({status:'PASS',scenarios:cases,rejected:10,precision:'intermediate decimals preserved'}));
