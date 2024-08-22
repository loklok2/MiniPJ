import SignUpForm from './SignUpForm';

export default function SignUp() {
    return (
        <div 
            className="w-full h-full 
                        flex flex-col justify-center items-center">
            {/* 
                SignUpForm 컴포넌트를 렌더링하며, onSignUp prop을 통해
                회원가입 완료 시 호출되는 콜백 함수를 전달합니다.
                이 콜백 함수는 현재로서는 회원가입된 user 객체를 콘솔에 출력합니다.
            */}
            <SignUpForm onSignUp={(user) => console.log('회원가입 완료:', user)} />
        </div>
    );
}

/* 
변수 및 함수 설명:
- SignUpForm: 회원가입 폼을 렌더링하는 컴포넌트입니다. 회원가입 폼이 제출되면 onSignUp이라는 prop을 통해 전달된 콜백 함수가 호출됩니다.
- user: 회원가입이 완료된 후 전달되는 사용자 정보를 담고 있는 객체입니다. 이 객체에는 일반적으로 사용자 ID, 이메일, 이름 등의 정보가 포함됩니다.

옵션 및 기능 설명:
- onSignUp: 회원가입이 성공적으로 이루어진 후 호출되는 콜백 함수입니다. 이 예제에서는 회원가입이 완료된 사용자 정보를 콘솔에 출력합니다. 이 콜백은 SignUpForm 컴포넌트에 의해 호출됩니다.
- w-full: Tailwind CSS 클래스, 요소의 너비를 부모 요소의 전체 너비로 설정합니다.
- h-full: Tailwind CSS 클래스, 요소의 높이를 부모 요소의 전체 높이로 설정합니다.
- flex: Tailwind CSS 클래스, 요소를 Flexbox 컨테이너로 설정합니다.
- flex-col: Tailwind CSS 클래스, Flexbox 컨테이너의 주 축을 수직으로 설정합니다.
- justify-center: Tailwind CSS 클래스, Flexbox 컨테이너 내의 요소를 수직 중심에 배치합니다.
- items-center: Tailwind CSS 클래스, Flexbox 컨테이너 내의 요소를 수평 중심에 배치합니다.
*/
