import * as React from "react";

import { FetchResult, MutationFunctionOptions, useQuery, useSubscription } from "@apollo/client";

import { GET_MODULE } from "../queries";
import { useCustomState } from "../utils";
import { interfaceStateType } from "../types";
import { GenericClass } from "./genericClass";
import { moduleType } from "../types/program";
import { ModuleInterface } from "../interfaces";
import { WATCH_MODULE } from "../subscriptions";

export class Module extends GenericClass<moduleType> implements ModuleInterface {
    async save(
        updateModule: (options?: MutationFunctionOptions) => Promise<FetchResult<any>>, 
    ) {
        await updateModule({variables: {id: this.id, title: this.obj?.title}})
    }
}

export function useModule(id?: string) {
    const module = new Module(id || null);
    
    [module.obj, module.setObj] = React.useState<moduleType | null>(null);
    [module.state, module.setState] = useCustomState<interfaceStateType>({});
    [module.id, module.setId] = React.useState<string | null>(id || null);

    const { error, refetch } = useQuery(GET_MODULE, {skip: true});
    const moduleSubscription = useSubscription(WATCH_MODULE, {variables: {id: id}});

    React.useEffect(() => {
        if (!module.state.initialized) {
            module.setState({initialized: true});
            const getModuleWrapper = async () => {
                if (id) {
                    module.setId(id);
                    const loadedModule = (await refetch({id: id})).data.module as moduleType
                    module.setObj(loadedModule);
                }
            }
            getModuleWrapper()
        }
    }, [module.state])

    React.useEffect(() => {
        if (moduleSubscription?.data) {
            console.log("[Module][useModule] (module) >>", moduleSubscription?.data.watchModule)
            module.setObj(moduleSubscription.data.watchModule)
        }
    }, [moduleSubscription.data])

    React.useEffect(() => {
        if (id !== module.id) {
            module.setState({initialized: false});
        }
    }, [id]) 

    return {module}
}

