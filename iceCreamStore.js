// 아이스크림 판매 내역 -> transactions 배열
const transactions = [
    { scoops: ["Chocolate", "Vanilla", "Mint Chip"], total: 5.5 },
    { scoops: ["Raspberry", "StrawBerry"], total: 2 },
    { scoops: ["Vanilla", "Vanilla"], total: 4 }
];

// 수익 계산
const total = transactions.reduce((acc, curr) => acc + curr.total, 0);
console.log(`You've made ${total} $ today`);  // You've made 11.5 $ today

// 각 맛의 판매량
let flavorDistribution = transactions.reduce((acc, curr) => {
  curr.scoops.forEach(scoop => {
    if (!acc[scoop]) {
      acc[scoop] = 0;
    }
    acc[scoop]++;
  });
  return acc;
}, {});  // 결과값:  { Chocolate: 1, Vanilla: 3, Mint Chip: 1, Raspberry: 1, StrawBerry: 1 }

console.log(flavorDistribution);

const best = Object.keys(flavorDistribution).reduce((acc, cur)=>{
  if(flavorDistribution[acc]>flavorDistribution[cur]){
    return acc;
  }
  else{
    return cur;
  }
}, Object.keys(flavorDistribution)[0]);

console.log("완료!");