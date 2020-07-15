# Components

## 테스트 방법

1. 빌드

```
npm run build
```

2. export 삭제

```
/dist/Dscomponent.js 의 export { Dscomponent };를 지우고 저장
```

3. 결과 확인

```
root/test-demo/index.html 파일 열어서확인
```

## File Structure

```
17dscs
├── dist / 빌드된 파일이 만들어지는 위치
├── src / 컴포넌트 실제 제작하는 곳
│   ├── Components
│   │   ├── Canvas4.js (하단)유저액션 컨테이너
│   │   ├── Dsc4.js 전체 컨테이너
│   │   ├── Simulation4.js (상단)시뮬레이션 뷰 컨테이너
│   ├── actionCanvas (하단) 유저액션 컴포넌트
│   ├── simulators (상단) 시뮬레이션 뷰 컴포넌트
│   ├── datas 공유될 데이터
├── test-demo / 빌드된 파일 테스트하는 곳
```

## Data sharing

```js
// data.js 구조
class Data {
  constructor() {
    this.time = 0;
  }
  increase() {
    this.time += 1;
  }
}

const data = new Data();

export default data;
```

실제 데이터는 class의 property로 property 조작은 메소드로 진행

데이터 사용은 `import data from './datas/data'`

예를들어, 유저액션 뷰에서 `setInterval`로 1초마다 `data.increase()`를 하면 데이터시뮬레이션 뷰에서도 data변화가 적용됨.
