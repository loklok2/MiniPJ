import SignUpForm from './SignUpForm';

export default function SignUp() {
    return (
        <div className="w-full h-full 
                        flex flex-col justify-center items-center">
            <SignUpForm onSignUp={(user) => console.log('회원가입 완료:', user)} />
        </div>
    );
}
