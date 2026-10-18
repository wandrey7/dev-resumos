import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de grupo: marca `confirmarSenha` com `senhasDiferentes` quando não
 * bate com `senha`. Só mexe nessa chave, para não apagar erros nativos (required/minlength).
 */
export const senhasIguaisValidator: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const confirmar = grupo.get('confirmarSenha');
  if (!confirmar) return null;

  const senha = grupo.get('senha');
  const diferentes = !!senha && senha.value !== confirmar.value;
  const erros = { ...(confirmar.errors ?? {}) };

  if (diferentes) erros['senhasDiferentes'] = true;
  else delete erros['senhasDiferentes'];

  confirmar.setErrors(Object.keys(erros).length ? erros : null);
  return null;
};
