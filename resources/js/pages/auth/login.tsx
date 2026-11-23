import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
	status?: string;
	canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
	return (
		<>
			<Head title="Iniciar Sesión - Ruvar Bienes Raíces" />

			<PasskeyVerify
				label="Iniciar sesión con una llave de acceso"
				loadingLabel="Autenticando llave de acceso..."
				separator="O continúa con tu correo"
			/>

			<Form
				{...(typeof store?.form === 'function' ? store.form() : { action: store.url(), method: 'post' })}
				resetOnSuccess={['password']}
				className="flex flex-col gap-5"
			>
				{({ processing, errors }) => (
					<>
						<div className="grid gap-4">
							<div className="grid gap-1.5">
								<Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
									Correo Electrónico
								</Label>
								<Input
									id="email"
									type="email"
									name="email"
									required
									autoFocus
									tabIndex={1}
									autoComplete="email"
									placeholder="correo@ruvar.com"
									className="rounded-xl border-slate-200 text-xs py-2 dark:border-slate-700"
								/>
								<InputError message={errors.email} />
							</div>

							<div className="grid gap-1.5">
								<div className="flex items-center justify-between">
									<Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
										Contraseña
									</Label>
									{canResetPassword && (
										<TextLink
											href={request()}
											className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400"
											tabIndex={5}
										>
											¿Olvidó su contraseña?
										</TextLink>
									)}
								</div>
								<PasswordInput
									id="password"
									name="password"
									required
									tabIndex={2}
									autoComplete="current-password"
									placeholder="••••••••"
									className="rounded-xl border-slate-200 text-xs py-2 dark:border-slate-700"
								/>
								<InputError message={errors.password} />
							</div>

							<div className="flex items-center space-x-2 pt-1">
								<Checkbox
									id="remember"
									name="remember"
									tabIndex={3}
								/>
								<Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
									Recordar sesión
								</Label>
							</div>

							<Button
								type="submit"
								className="mt-2 w-full rounded-xl bg-[#0b1a30] py-2.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-[#15233c] hover:shadow-sm cursor-pointer"
								tabIndex={4}
								disabled={processing}
								data-test="login-button"
							>
								{processing && <Spinner className="mr-2" />}
								Iniciar Sesión en el Panel
							</Button>
						</div>
					</>
				)}
			</Form>

			{status && (
				<div className="mb-4 text-center text-xs font-medium text-emerald-600">
					{status}
				</div>
			)}
		</>
	);
}

Login.layout = {
	title: 'Acceso Administrativo',
	description: 'Ingrese sus credenciales para acceder a la gestión de bienes raíces',
};
