import $ from 'cafy';
import define from '../../define';
import { ApiError } from '../../error';
import { Users, UserWalletAddresses } from '../../../../models';
import { UserWalletAddress } from '../../../../models/entities/user-wallet-address';
import { ID } from '@/misc/cafy-id';

export const meta = {
	tags: ['wallet'],

	requireCredential: true as const,

	params: {
		userId: {
			validator: $.optional.nullable.type(ID),
			desc: {
				'ja-JP': '対象のユーザーのID',
				'en-US': 'Target user ID'
			}
		},

		username: {
			validator: $.optional.str
		},

		host: {
			validator: $.optional.nullable.str
		},
	},

	res: {
		type: 'object' as const,
		optional: false as const, nullable: false as const,
		ref: 'Wallet',
	},

	errors: {
		noSuchUser: {
			message: 'No such user.',
			code: 'NO_SUCH_USER',
			id: '88b36214-5918-4cec-be59-df48a42c53d7'
		}
	},
};

export default define(meta, async (ps, me) => {
	const user = me != null ? await Users.findOne(ps.userId != null
		? { id: ps.userId }
		: { id: me.id }) : null;

	if (user == null) {
		throw new ApiError(meta.errors.noSuchUser);
	}

	let wallet: UserWalletAddress = (await UserWalletAddresses.findOne({ userId: user.id }) as UserWalletAddress);

	if (wallet) {
		return wallet.address;
	} else {
		return '';
	}
});
