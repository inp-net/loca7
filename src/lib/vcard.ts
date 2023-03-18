import slugify from 'slugify';
import {
	EmailProperty,
	FNProperty,
	IntegerType,
	PrefParameter,
	TelProperty,
	TextType,
	TypeParameter,
	VCARD
} from 'vcard4';

export function vcard(user: { name: string; phone?: string; email: string }): {
	url: string;
	filename: string;
} {
	const filename = `${slugify(user.name)}.vcf`;

	const name = new FNProperty([], new TextType(user.name));
	const phone = user?.phone
		? new TelProperty(
				[new TypeParameter(new TextType('home'), 'TelProperty')],
				new TextType(user?.phone)
		  )
		: null;
	const email = new EmailProperty(
		[new PrefParameter(new IntegerType(1))],
		new TextType(user.email)
	);
	const vcard = new VCARD(phone ? [name, phone, email] : [name, email]);

	return {
		filename,
		url: URL.createObjectURL(new File([vcard.repr()], filename, { type: 'text/vcard' }))
	};
}
