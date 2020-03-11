
요즘 여기저기서 Typescript(이하, 타입스크립트)를 많이 사용합니다. 타입스크립트의 타입정의는 여러사람이 협업할 때 굉장히 유용합니다.



타입스크립트에서는 클래스도 인터페이스로 처리합니다.


다음 예시코드를 봅시다.

```typescript
class User {
  public constructor(public name: string) {
    //
  }
}

function say(user: User) {
  console.log(`hello, ${user.name}!`)
}
```

```typescript

say(new User('wan2land')) // print 'hello, wan2land!'

say({ name: 'wan3land' })  // print 'hello, wan3land!'
```

이 말은, 타입으로 클래스를 지정하였다고 하더라도 해당 클래스를 프로토타입으로 갖는 객체가 들어온다고 확신하면 안된다는 걸 의미합니다.

```typescript
function say(user: User) {
  if (user instanceof User) {
    console.log(`hello, ${user.name}!`)
  } else {
    // whoops!
  }
}
```
