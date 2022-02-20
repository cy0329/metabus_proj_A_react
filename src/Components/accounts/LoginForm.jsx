import { useApiAxios } from 'api/base';
import useFieldValues from 'hooks/useFieldValues';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import DebugStates from 'DebugStates';
import Button from 'Button';
import '../../App.css';

const INITIAL_FIELD_VALUES = { userID: '', password: '' };

function LoginForm() {
  const navigate = useNavigate();

  // const [auth, _, login] = useAuth();

  const { auth, login } = useAuth();
  const [{ loading, error }, requestToken] = useApiAxios(
    {
      url: `/accounts/api/token/`,
      method: 'POST',
    },
    { manual: true },
  );

  const { fieldValues, handleFieldChange } =
    useFieldValues(INITIAL_FIELD_VALUES);

  const handleSubmit = (e) => {
    e.preventDefault();

    requestToken({ data: fieldValues }).then((response) => {
      const {
        access,
        refresh,
        userID,
        nickname,
        name,
        phone_number,
        email,
        region,
        password_quiz,
        password_quiz_answer,
        is_staff,
      } = response.data;
      // TODO: access/refresh token을 브라우저 어딘가에 저장해야 합니다.
      // 저장해서 페이지 새로고침이 발생하더라도 그 token이 유실되지 않아야 합니다.
      login({
        access,
        refresh,
        userID,
        nickname,
        name,
        phone_number,
        email,
        region,
        password_quiz,
        password_quiz_answer,
        is_staff,
      });

      console.log('access :', access);
      console.log('refresh :', refresh);
      console.log('userID :', userID);
      console.log('nickname :', nickname);
      console.log('name :', name);
      console.log('phone_number :', phone_number);
      console.log('email :', email);
      console.log('region :', region);
      console.log('password_quiz :', password_quiz);
      console.log('password_quiz_answer :', password_quiz_answer);
      console.log('is_staff :', is_staff);

      // 인증 후, 이동할 주소를 지정합니다.
      navigate('/');
    });
  };

  return (
    <div className="header">
      <h2 className="text-center text-3xl py-5 pb-5 font-bold"> 🐹 Login </h2>
      <hr />

      {error?.response?.status === 401 && (
        <div className="text-red-400">로그인에 실패했습니다.</div>
      )}
      <div className="flex justify-center">
        <div className="max-w-m">
          <form
            className="bg-white shadow-md rounded-xl px-20 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mt-3 mb-4">
              <label className=" block text-gray-700 text-xl font-bold mb-2">
                ID
              </label>

              <input
                type="text"
                name="userID"
                value={fieldValues.userID}
                onChange={handleFieldChange}
                placeholder="userID"
                className=" shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-xl font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={fieldValues.password}
                onChange={handleFieldChange}
                placeholder="**************"
                className="shadow appearance-none border border-red-500 rounded w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="text-center text-2xl">
              <Button>로그인</Button>
            </div>
          </form>
        </div>
      </div>
      <p className="py-3 pb-3" />
      <DebugStates auth={auth} fieldValues={fieldValues} />
    </div>
  );
}

export default LoginForm;
