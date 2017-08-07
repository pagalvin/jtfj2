export class Util {

    static async WaitForMs(msecs: number): Promise<boolean> {

        return new Promise<boolean>( (resolve, reject) => {

            window.setTimeout( () => {
                resolve(true);
            }, msecs);
        })

    }
}