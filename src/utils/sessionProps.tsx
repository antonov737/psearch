import type {Session} from "@auth/core/types";

export type SessionProps = {
    session: Session | null,
    allow_login: boolean
}