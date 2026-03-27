export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: "이메일과 비밀번호를 확인한 뒤 다시 시도해 주세요.",
    demoLoginFailed:
      "데모 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    signupFailed:
      "회원가입을 완료하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.",
    serviceUnavailable:
      "인증 서비스 연결을 확인할 수 없습니다. 환경설정(.env)을 확인한 뒤 다시 시도해 주세요.",
    retry:
      "요청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  },
} as const;
