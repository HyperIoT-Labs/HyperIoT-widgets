import { WidgetComponent } from "./widget.component";


export abstract class WidgetSingleValueComponent extends WidgetComponent {
    private value:string;
    private refreshingValue: boolean = false;
    private refreshHandler;

    protected updateValue(newValue:string){
        this.value = newValue;
    }

    protected getValue() : string{
        return this.value;
    }

    protected resetValue(){
        this.value = null;
    }

   protected startRefreshTask(refreshInterval){
    let self = this;
    this.refreshHandler = setInterval(function(){
        if(!self.refreshingValue){
          self.refreshingValue = true;
          self.renderData();
          //avoind multiple refresh if one is already running
          self.refreshingValue = false;
        }
    },refreshInterval);
  }

  protected stopRefreshTask(){
      clearInterval(this.refreshHandler);
  }

  protected abstract renderData();
}
