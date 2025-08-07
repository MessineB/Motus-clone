export function getAnonId(): string {
    if (typeof window === 'undefined') return '';
  
    try {
      let anonId = localStorage.getItem('anonId');
      if (!anonId || !isValidUUID(anonId)) {
        anonId = crypto.randomUUID(); // Génère un nouvel UUID si absent ou invalide
        localStorage.setItem('anonId', anonId);
      }
      return anonId;
    } catch (error) {
      console.error('Erreur lors de l’accès à localStorage pour anonId', error);
      return '';
    }
  }
  
  function isValidUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  }
  