package com.kh.dolbomi.exception;

import lombok.Getter;

@Getter
//abstract : 이 클래스는 직접 사용할 수 없게 만들고, 구체적인 예외 클래스가 상속받아 사용할 수 있어야 한다.
public abstract class BaseException extends RuntimeException {
    //RuntimeException: 체크 예외가 아닌 언체크 예외로 처리하겠다는 의미.

    private final ErrorCode errorCode;
    //예외 발생시 구체적인 에러정보를 담는 enum타입 객체
    //이를 통해서 상태코드와 에러메세지를 통합관리함.

    public BaseException(final ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    //ErrorCode는 유지하되, 메세지는 커스텀 문자열을 사용할 수 있음.
    //특정상황에 더 구체적인 설명을 하고싶을 때 errorcode의 값을 늘리지않고 간단하게 처리 가능.
    public BaseException(final ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    //실제 발생한 예외(cause)를 함께 전달.
    //우리가 만든 예외(BaseException)로 실제 발생한 예외를 감싸서 다시 던지는 방식
    public BaseException(final ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}