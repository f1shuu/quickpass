import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';

export default function PasswordCreator() {
    return (
        <Container title={translate('createPassword')} />
    )
}