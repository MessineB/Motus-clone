import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoseModalProps {
  open: boolean;
  onClose: () => void;
  onSignup?: () => void;
  showSignupCTA?: boolean;
}

const LoseModal: React.FC<LoseModalProps> = ({ open, onClose, onSignup, showSignupCTA }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle>😢 Dommage !</DialogTitle>
        </DialogHeader>
        <p className="mt-2">Tu n’as pas trouvé le mot aujourd’hui. Reviens demain !</p>

        {showSignupCTA && (
          <div className="mt-4">
            <p className="mb-2">Crée un compte pour suivre ta progression 📈</p>
            <Button onClick={onSignup}>Créer un compte</Button>
          </div>
        )}

        <Button className="mt-4" variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LoseModal;
