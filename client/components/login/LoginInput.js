import React from 'react';		
//Didn't copy signupInput component because we may add additional input fields to that
const LoginInput = (props) =>{
	return (
		<div className="font">
			<form onSubmit={props.onSubmit}>
				<h1 className="login-signup-words font"> Login </h1>
				<div className="form-group">
					<label className="control-label login-signup-words"> Username</label>
					<input
						onChange={props.onChange}
						type="text"
						name="userName"
						className="form-control"	
					/>
					</div>

				<div className="form-group">
					<label className="control-label login-signup-words">Password</label>
					<input
						onChange={props.onChange}
						type="password"
						name="password"
						className="form-control"
					/>
					</div>

					<div className="form-group">
						<button className="btn btn-secondary btn-lg">Login
						</button>
					</div>
				</form>
		</div>
	)
}

export default LoginInput;