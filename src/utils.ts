export function convertEnter(originText: string): string[] {
    return originText ? originText.split('\r\n') : [];
}